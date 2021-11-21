import { Fragment } from "react";
import EmiCalculator from "./components/EmiCalculator/EmiCalculator";
import Header from "./components/Header/Header";

function App() {
  return (
    <Fragment>
      <Header />
      <EmiCalculator />
    </Fragment>
  );
}

export default App;
