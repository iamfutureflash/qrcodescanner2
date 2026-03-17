import "./App.css";
import HtmlQRCode from "./components/HtmlQRCode";

function App() {
  return (
    <HtmlQRCode
      onSuccess={(value: string | null) => {
        console.log({ value });
      }}
      onError={() => {
        // console.log({ err });
      }}
    />
  );
}

export default App;
