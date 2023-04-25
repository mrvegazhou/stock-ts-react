import { init, Models, RematchDispatch, RematchRootState } from "@rematch/core";
import admin from "@/models/admin";
import sys from "@/models/sys";
import app from "@/models/app";
import imgs from "@/models/imgs";

export interface RootModel extends Models<RootModel> {
	admin: typeof admin;
	sys: typeof sys;
	app: typeof app;
	imgs: typeof imgs;
}

const rootModel: RootModel = { admin, sys, app, imgs };
const store = init({
	models: rootModel,
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

export default store;
