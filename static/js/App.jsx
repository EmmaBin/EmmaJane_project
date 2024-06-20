const { BrowserRouter, Route, Switch } = ReactRouterDOM;

function App() {
    return (
        <BrowserRouter>
            <div>
                <h1>Hello, React!</h1>
                {/* Define routes here if needed */}
            </div>
        </BrowserRouter>
    );
}

const domNode = document.getElementById('main');
const root = ReactDOM.createRoot(domNode);
root.render(<App />);
