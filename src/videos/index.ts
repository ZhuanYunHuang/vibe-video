import { VideoSpec } from "../shared";
import { webRequest } from "./web-request/spec";
import { qrcode } from "./qrcode/spec";
import { binarySearch } from "./binary-search/spec";
import { routePlanning } from "./route-planning/spec";
import { shengben } from "./shengben/spec";
import { flowState } from "./flow-state/spec";
import { barnum } from "./barnum/spec";
import { laicai } from "./laicai/spec";
import { laicaiCyber } from "./laicai-cyber/spec";
import { duanshipin } from "./duanshipin/spec";
import { roadster } from "./roadster/spec";
import { iphoneFold } from "./iphone-fold/spec";
import { patienceBattery } from "./patience-battery/spec";
import { graduationMv } from "./graduation-mv/spec";
import { wangwei } from "./wangwei/spec";
import { gali } from "./gali/spec";
import { xiahun } from "./xiahun/spec";

// 视频清单：新增一支视频，在这里加一行即可
export const VIDEOS: VideoSpec[] = [webRequest, qrcode, binarySearch, routePlanning, shengben, flowState, barnum, laicai, laicaiCyber, duanshipin, roadster, iphoneFold, patienceBattery, graduationMv, wangwei, gali, xiahun];
