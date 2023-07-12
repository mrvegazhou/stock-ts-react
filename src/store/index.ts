import { init, Models, RematchDispatch, RematchRootState } from "@rematch/core";
import admin from "@/models/admin";
import sys from "@/models/sys";
import app from "@/models/app";
import imgs from "@/models/imgs";
import imgLibrary from "@/models/imgLibrary";
import feedback from "@/models/feedback";
import searchLog from "@/models/searchLog";
import advertisement from "@/models/advertisement";

export interface RootModel extends Models<RootModel> {
	admin: typeof admin;
	sys: typeof sys;
	app: typeof app;
	imgs: typeof imgs;
	imgLibrary: typeof imgLibrary;
	feedback: typeof feedback;
	searchLog: typeof searchLog;
	advertisement: typeof advertisement;
}

const rootModel: RootModel = { admin, sys, app, imgs, imgLibrary, feedback, searchLog, advertisement };
const store = init({
	models: rootModel,
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

export default store;
