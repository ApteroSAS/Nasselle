"use client";
import {AppLoader} from "dashboard-core";
import {lazy} from "react";
import {NSL_ROUTER_RES} from "@/configuration/MeshAppConfiguration";

const App = lazy(() => import("../app/App"));// Lazy load App component

export default function Home() {
  return <AppLoader AppComponent={App} providers={async () => {
    const {
      appConfigContext,
      getAuthProvider,
      getFirebaseDataProvider,
      addResource,
      multiDataProvider,
      USERS_RESOURCE} = await import("dashboard-core");
    appConfigContext.defaultLogo = `${process.env.NEXT_PUBLIC_BASE_PATH}/logo-nasselle-V1.svg`;
    appConfigContext.defaultTitle = 'NSL Router';
    let authProvider = await getAuthProvider();
    let firebaseProvider = await getFirebaseDataProvider();
    //console.log(await firebaseProvider.getOne('users', {id: "n5ZeDHHZ59f9GF0eIaiAU8Mnqjr1"}));
    addResource(USERS_RESOURCE, firebaseProvider); // Add users resource mandatory for authProvider
    addResource(NSL_ROUTER_RES, firebaseProvider);
    return {
      authProvider: authProvider,
      dataProvider: multiDataProvider,
    }
  }}/>;
}
