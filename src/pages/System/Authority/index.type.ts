/** 当前页面所需所有类型声明 **/

// import { PowerTreeDefault } from "@/components/TreeChose/PowerTreeTable";
import { Role } from "@/models/index.type";
import { History } from "history";
import { match } from "react-router-dom";
// export type { PowerTree, RoleParam, Role, Res } from "@/models/index.type";


export type Props = {
  history: History;
  location: Location;
  match: match;
};
