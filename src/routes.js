import React from "react";
import GameOptionInsert from "./views/pages/game/GameOptionInsert";
import GameConsoleList from "./views/pages/game/GameConsoleList";
import GameOptionList from "./views/pages/game/GameOptionLists";
import GameTime from "./views/pages/game/GameTimes";
import GameConsoleInsert from "./views/pages/game/GameConsoleInsert";
import GameOptionUpdate from "./views/pages/game/GameOptionUpdate";
//Home
const Home = React.lazy(() => import("./views/pages/Home/Home"));

//Role
const InsertRole = React.lazy(() => import("./views/pages/role/InsertRole"));
const ListRole = React.lazy(() => import("./views/pages/role/listRole"));
const UpdateRole = React.lazy(() => import("./views/pages/role/updateRole"));

//User
const ListUser = React.lazy(() => import("./views/pages/user/listUser"));
const Register = React.lazy(() => import("./views/pages/user/Register"));
const UpdateUser = React.lazy(() => import("./views/pages/user/updateUser"));
const UpdateUserPass = React.lazy(() =>
  import("./views/pages/user/updateUserPass")
);

//Service
const InsertService = React.lazy(() =>
  import("./views/pages/service/crud/InsertService")
);
const ListService = React.lazy(() =>
  import("./views/pages/service/crud/listService")
);
const UpdateService = React.lazy(() =>
  import("./views/pages/service/crud/updateService")
);

//Customer
const AddCustomer = React.lazy(() =>
  import("./views/pages/customer/AddCustomer")
);
const ListCustomer = React.lazy(() =>
  import("./views/pages/customer/listCustomer")
);
const UpdateCustomer = React.lazy(() =>
  import("./views/pages/customer/updateCustomer")
);

//Entry
const ListEnter = React.lazy(() => import("./views/pages/entry/listEntry"));
const InsertEnter = React.lazy(() => import("./views/pages/entry/InsertEntry"));
const UpdateEntry = React.lazy(() => import("./views/pages/entry/updateEntry"));

//Expense
const ListExpense = React.lazy(() =>
  import("./views/pages/expense/listExpense")
);
const InsertExpense = React.lazy(() =>
  import("./views/pages/expense/InsertExpense")
);
const UpdateExpense = React.lazy(() =>
  import("./views/pages/expense/updateExpense")
);

const ListExpenseMonth = React.lazy(() =>
  import("./views/pages/expense/listExpenseMonth")
);

//Expense category
const ListExpenseCategorie = React.lazy(() =>
  import("./views/pages/expenseCategory/listExpenseCategory")
);
const InsertExpenseCategorie = React.lazy(() =>
  import("./views/pages/expenseCategory/InsertExpenseCategory")
);
const UpdateExpenseCategorie = React.lazy(() =>
  import("./views/pages/expenseCategory/updateExpenseCategory")
);

//Purchase
const ListPurchase = React.lazy(() =>
  import("./views/pages/purchase/listPurchase")
);
const PurchaseDetail = React.lazy(() =>
  import("./views/pages/purchase/purchaseDetail")
);
const AddPurchase = React.lazy(() =>
  import("./views/pages/purchase/addPurchase")
);

//Debt
const DebtDetail = React.lazy(() => import("./views/pages/debt/debtDetail"));
const ListDebt = React.lazy(() => import("./views/pages/debt/listDebt"));
const DebtPayementDetail = React.lazy(() =>
  import("./views/pages/debt/debtPaymentDetails")
);
const ListDebtCustomer = React.lazy(() =>
  import("./views/pages/debt/listDebtCustomer")
);

//Statistique
const GlobalStatistique = React.lazy(() =>
  import("./views/pages/Statistique/GlobalStatistique")
);

const routes = [
  //Home
  {
    path: "/Home",
    name: "",
    component: Home,
  },
  //Role
  {
    path: "/addRole",
    name: "Ajout Role",
    component: InsertRole,
  },
  {
    path: "/role/list",
    name: "Liste role",
    component: ListRole,
  },
  {
    path: "/role/update/:id",
    name: "Modification role",
    component: UpdateRole,
  },
  //User
  {
    path: "/user/list",
    name: "Liste Utilisateur",
    component: ListUser,
  },

  {
    path: "/register",
    name: "Ajout Utilisateur",
    component: Register,
  },
  {
    path: "/user/update/info/:id",
    name: "Modification info utilisateur",
    component: UpdateUser,
  },
  {
    path: "/user/update/password/:id",
    name: "Modification mot de passe utilisateur",
    component: UpdateUserPass,
  },
  //Service
  {
    path: "/service/insert",
    name: "Ajout Service",
    component: InsertService,
  },
  {
    path: "/service/list",
    name: "Liste Service",
    component: ListService,
  },
  {
    path: "/service/update/:id",
    name: "Modification Service",
    component: UpdateService,
  },
  //Customer
  {
    path: "/Customer/list",
    name: "Liste des clients",
    component: ListCustomer,
  },
  {
    path: "/customer/update/:id",
    name: "Modification client",
    component: UpdateCustomer,
  },
  {
    path: "/addCustomer",
    name: "Ajout Client",
    component: AddCustomer,
  },
  //Entry
  {
    path: "/entry/list",
    name: "Liste Entrée",
    component: ListEnter,
  },
  {
    path: "/entry/insert",
    name: "Ajout Entrée",
    component: InsertEnter,
  },
  {
    path: "/entry/update/:id",
    name: "Modification Entrée",
    component: UpdateEntry,
  },
  //Expense
  {
    path: "/expense/list",
    name: "Liste Sortie",
    component: ListExpense,
  },
  {
    path: "/expense/month/:month",
    name: "Liste sortie",
    component: ListExpenseMonth,
  },
  {
    path: "/expense/insert",
    name: "Ajout Sortie",
    component: InsertExpense,
  },
  {
    path: "/expense/update/:id",
    name: "Modification Sortie",
    component: UpdateExpense,
  },
  //Expense category
  {
    path: "/expenseCategory/list",
    name: "Liste Categorie Sortie",
    component: ListExpenseCategorie,
  },
  {
    path: "/expenseCategory/insert",
    name: "Ajout Categorie Sortie",
    component: InsertExpenseCategorie,
  },
  {
    path: "/expenseCategory/update/:id",
    name: "Modification Categorie Sortie",
    component: UpdateExpenseCategorie,
  },
  //Purchase
  {
    path: "/purchase/list",
    name: "Liste des achats",
    component: ListPurchase,
  },
  {
    path: "/Purchase/details/:id",
    name: "Details achat",
    component: PurchaseDetail,
  },
  {
    path: "/service/purchase/:debt",
    name: "Achat Service",
    component: Home,
  },
  //Debt
  {
    path: "/debt/list",
    name: "Liste des client avec dette",
    component: ListDebt,
  },
  {
    path: "/debt/customer/details/:id",
    name: "Liste des dettes du client",
    component: ListDebtCustomer,
  },
  {
    path: "/debt/details/:id",
    name: "Details dette",
    component: DebtDetail,
  },
  {
    path: "/debt/payment/:id",
    name: "Details payement",
    component: DebtPayementDetail,
  },
  // Statistique
  {
    path: "/statistique/global",
    name: "Statistique global",
    component: GlobalStatistique,
  },
  // Game Console
  {
    path: "/game/configuration/console/list",
    name: "Liste des consoles",
    component: GameConsoleList,
  },
  {
    path: "/game/console/insert",
    name: "Insertion console",
    component: GameConsoleInsert,
  },
  //Game Option
  {
    path: "/game/configuration/option/list",
    name: "Liste des options",
    component: GameOptionList,
  },
  {
    path: "/game/option/insert",
    name: "Insertion option",
    component: GameOptionInsert,
  },
  {
    path: "/game/option/update",
    name: "Modification option",
    component: GameOptionUpdate,
  },

  //Game time
  {
    path: "/game/time",
    name: "Temps",
    component: GameTime,
  },
];
export default routes;
