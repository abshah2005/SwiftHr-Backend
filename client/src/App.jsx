
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CheckStatus from "./Components/CheckStatus";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ApplicationId from "./components/ApplicantId";
import ApplicationForm from "./components/ApplicationForm";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<ApplicationForm/>}/>
            <Route path="/check" element={<CheckStatus />} />
            <Route
              path="/application-status/:Tid"
              element={<ApplicationId/>}
            />
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
