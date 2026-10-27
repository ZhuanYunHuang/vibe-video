---
name: "audio-separation"
description: "在本项目中用 Demucs 分离歌曲的人声/伴奏（或鼓/贝斯/人声/其他四轨）。所有成品必须输出到项目根 `out/` 目录，`work/` 只允许放临时中间件且用完即删。当用户要求'分离人声和伴奏''提取伴奏''做卡拉OK版''扒一条人声轨''去掉背景音乐'时调用。"
---

# 音频分离（Audio Separation）

用本地 Demucs（htdemucs 模型）把一首歌拆成人声轨与伴奏轨交付给用户。

## 何时使用

- 用户要求「分离人声和伴奏」「提取伴奏 / 去人声」「做卡拉 OK 版」「扒人声轨」「把这首歌拆开」。
- 用户上传音频并指定某首歌做分离。

## 铁律（不要违反）

1. **成品一律输出到项目根 `out/`**：`d:\newDownload\project\vibe-video\out\`。
   - 不允许把分离成品留在 `work/`、`public/`、`src/`、项目子目录或临时目录。
   - `work/` 只用于 Demucs 的原始输出等中间件，**交付后立刻清理**（含空目录）。
2. **交付同时给无损与试听两种格式**：WAV（44.1kHz / 立体声 / 16bit，保持 Demucs 原生输出）＋ 320kbps MP3。
3. **不改动 `public/<id>/bgm.mp3` 等既有渲染素材**：那些是视频工程的渲染依赖（`spec.ts` 通过 `staticFile()` 引用），移走会导致对应视频渲染失败。
4. **文件名用 ASCII 短横线命名**，不要用中文名（跨工具易乱码）：
   - `<歌曲slug>-vocals.wav` / `<歌曲slug>-vocals.mp3`
   - `<歌曲slug>-instrumental.wav` / `<歌曲slug>-instrumental.mp3`
   - 例：`chun-jiao-yu-zhi-ming-vocals.mp3`
5. **交付前必须校验**：两条轨时长与源文件一致、峰值不削波、人声轨在纯伴奏段落近似静音。校验不通过要说出来，不要直接交付。

## 环境

| 项目 | 值 |
| --- | --- |
| Demucs | `C:\Users\Administrator\.local\bin\demucs.exe`（`uv tool install demucs` 装，版本 4.1.0） |
| 模型 | `htdemucs`（默认，首次运行会下载权重） |
| ffmpeg | `node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe`（**没有 ffprobe**，用它加 `-i` 看信息） |

若报 `ModuleNotFoundError: No module named 'numpy'`：

```powershell
uv pip install --python "C:\Users\Administrator\AppData\Roaming\uv\tools\demucs\Scripts\python.exe" numpy
```

## 流程（5 步）

### 0 · 加密容器先解密

若源文件是视频（`.mp4`）或网易云加密容器（`.ncm`），先转成标准音频再分离：

- **视频**：`& $ff -y -loglevel error -i <video> -vn -ac 2 -ar 44100 -c:a pcm_s16le work\audio\<slug>.wav`（注意视频里的音轨常常只有单声道低码率，要提前告知用户精度受限）。
- **`.ncm`**：用本 Skill 自带的解密脚本，一步出标准 MP3/FLAC：

```powershell
node ".trae\skills\audio-separation\scripts\ncm-decrypt.mjs" "<input.ncm>" "work\audio\<slug>.mp3"
```

脚本会打印曲名/歌手/时长并校验输出头部（`ID3`/帧同步/`fLaC`）；解出的文件用 ffmpeg `-i` 复核时长是否与元数据一致。解密后的原曲可以顺手复制一份到 `out/` 交付。

### 1 · 探测源文件

用户上传的音频先复制进 `work\audio\`（无此目录就建），再用 ffmpeg 看格式：

```powershell
& "node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe" -hide_banner -i "work\audio\<file>" 2>&1 | Select-String "Duration|Stream"
```

记录时长、采样率、声道、码率，后面校验要用。

### 2 · 跑分离（后台）

```powershell
demucs --two-stems=vocals -n htdemucs --shifts 1 --overlap 0.25 -o "work\stems\<slug>" "work\audio\<file>"
```

- 3 分钟左右的歌约 1.5–2 分钟跑完，**用 `run_in_background` 跑**，别阻塞。
- 输出位置固定：`work\stems\<slug>\htdemucs\<file-basename>\vocals.wav` 与 `no_vocals.wav`。
- 想要更好质量：`--shifts 2`（约 2 倍耗时）；想换模型：`-n htdemucs_ft`（微调版，更慢更准）。

### 3 · 转 320k MP3

```powershell
$ff = "node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe"
& $ff -y -loglevel error -i "<stem>.wav" -c:a libmp3lame -b:a 320k "<stem>.mp3" 2>&1 | Out-File "$env:TEMP\enc.log"
```

### 4 · 移入 `out/` 并按约定重命名，然后清理 `work/`

```powershell
$o = "d:\newDownload\project\vibe-video\out"
Move-Item "<stem>.wav" "$o\<slug>-vocals.wav" -Force
Move-Item "<stem>.mp3" "$o\<slug>-vocals.mp3" -Force
# 伴奏同理 → <slug>-instrumental.wav / .mp3
Remove-Item "work\stems","work\audio" -Recurse -Force
```

### 5 · 校验与交付

- 用 ffmpeg `-i` 确认两条 WAV 的时长、采样率与源文件一致（Demucs 输出与源**逐样本对齐**，可反相抵消）。
- 用临时 node 脚本读 WAV 头算 RMS：人声轨整体应比伴奏轨低几 dB，纯伴奏段落（如前奏）人声轨应接近 −70 dBFS。
- 汇报：`out/` 绝对路径、时长、两条轨 RMS/峰值、以及「两条轨对齐、可叠加还原」这一结论。

## 可选：四轨分离

去掉 `--two-stems=vocals`，默认输出 `drums.wav / bass.wav / other.wav / vocals.wav`。命名到 `out/` 时用 `<slug>-drums` 等后缀。用户只说「人声和伴奏」时**不要**擅自给四轨。

## 常见坑

- **PowerShell 把 ffmpeg 的 stderr 当报错**（非零退出码也照常执行）：加 `-loglevel error` 或 `2>&1 | Out-File`。
- **没有 ffprobe**：不要用 `ffprobe`，改用 `ffmpeg -hide_banner -i`。
- **HF 未认证警告**（`You are sending unauthenticated requests to the HF Hub`）：正常，忽略。
- **MP3 文件大小相同不是 bug**：CBR 320k 下同长度的两条轨帧数一致，字节数自然相同；用哈希确认内容不同即可。
- **`volumedetect` / `astats` 滤镜不可用**：Remotion 自带 ffmpeg 未编译这些滤镜，RMS 用 node 直接读 PCM。
- **`.ncm` 解密后一定要验头部**：`ID3` 是 3 字节，判断时不要拿 4 字节切片去比；音频流密钥流是 256 字节循环（`ks[i] = box[(box[j]+box[(box[j]+j)&0xff])&0xff]`，`j=(i+1)&0xff`），密钥要**去掉 PKCS7 填充**再建盒，否则解出来是噪声。
- **`.ncm` 元数据 JSON 尾部有填充字节**：`JSON.parse` 前先截取首个 `{` 到末个 `}`。
- **48kHz 源经 Demucs 会重采样到 44.1kHz**：校验时长看秒数是否一致，别比采样率。
