import React from "react";

import ProductForm from "./components/admin/ProductForm";
import AppHeader from "./components/common/AppHeader";
import AppMenu from "./components/common/AppMenu";
import SideBar from "./components/common/SideBar";

export default function App() {
  return (
    <>
      <AppContent />
    </>
  );
}

function AppContent() {
  return (
    <React.Fragment>
      <AppHeader />
      <AppMenu />
      <div className="container mt-1">
        <div className="row">
          <div className="col-sm-3">
            <SideBar />
          </div>
          <div className="col-sm-9" style={{ zIndex: 1 }}>
            <ProductForm />
          </div>
        </div>
      </div>

      <hr />
    </React.Fragment>
  );
}
