

export default function Login() {
    console.log("log in ")

    const [values, setValues] = React.useState({
        password: "",
        showPassword: false,
      });

    return (

        <div>
            <form onSubmit={handleLogin}>
                <h4>
                    Log In
                </h4>
                <div>
                    <label>Email address</label>
                    <input type="text"
                            id="email" 
                            name="email" 
                            onChange={setEmail}
                            placeholder="Your email" aria-label="Email" />
                    <label>Password</label>
                    <input type={values.showPassword ? "text" : "password"} 
                            id="password" 
                            name="password" 
                            onChange={setPassword}
                            placeholder="Your password" aria-label="Password" />
                </div>
                <div>
                    <input type="submit"  value="Submit" />
                    <ReactRouterDOM.Link to='/create' >I'm a new user. Sign up</ReactRouterDOM.Link>
                </div>
            </form>
        </div>
        
    )
}