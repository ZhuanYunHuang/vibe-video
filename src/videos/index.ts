import { VideoSpec } from "../shared";
import { webRequest } from "./web-request/spec";
import { qrcode } from "./qrcode/spec";
import { binarySearch } from "./binary-search/spec";
import { routePlanning } from "./route-planning/spec";

// 视频清单：新增一支视频，在这里加一行即可
export const VIDEOS: VideoSpec[] = [webRequest, qrcode, binarySearch, routePlanning];
