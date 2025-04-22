import { AuthRouteEnum, AppRouteEnum } from "./route.enum";

export interface RoutePaths {
  AUTH: typeof AuthRouteEnum;
  APP: typeof AppRouteEnum;
}

export type RouteGroup = keyof RoutePaths;

export type RouteKey<T extends RouteGroup> = T extends "AUTH"
  ? keyof typeof AuthRouteEnum
  : T extends "APP"
  ? keyof typeof AppRouteEnum
  : never;
