import React, { useState, useContext } from "react";
import UserContext from "./UserContext";
import ConnectionContext from "./connection-context";
import { API_URL, API_TOKEN } from './constants';
const LoginForm = () => {

    const { login } = useContext(UserContext);
    const { connect } = useContext(ConnectionContext);
    const [token, setToken] = useState("");

    const onSubmit = e => {
        e.preventDefault();
        if (!token) return;

        fetch(API_URL + '/client/sign-in', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
            .then(res => res.json())
            .then((user) => {
                connect();
                login(user);
            });

    };

    const onSelectChange = setter => e => {
        setter(e.target.value);
    };


    return (
        <form onSubmit={onSubmit}>
            <div>Login...</div>
            <div className="form-group">
                <label>Select user</label>
                <select className="form-control" onChange={onSelectChange(setToken)}>
                    <option value="">- Select a user -</option>
                    <option value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvbGl2ZXIiLCJuYW1lIjoiT2xpdmVyIFdpbnRlciIsImV4cCI6MjUxNjIzOTAyMiwiaXNzIjoic3RhdGljLWZvci1kZW1vIiwiY2xpZW50X2lkIjoiV2VhdnlEZW1vIiwiZGlyIjoiY2hhdC1kZW1vLWRpciIsImVtYWlsIjoib2xpdmVyLndpbnRlckBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoib2xpdmVyIn0.VuF_YzdhzSr5-tordh0QZbLmkrkL6GYkWfMtUqdQ9FM">Oliver Winter</option>
                    <option value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsaWxseSIsIm5hbWUiOiJMaWxseSBEaWF6IiwiZXhwIjoyNTE2MjM5MDIyLCJpc3MiOiJzdGF0aWMtZm9yLWRlbW8iLCJjbGllbnRfaWQiOiJXZWF2eURlbW8iLCJkaXIiOiJjaGF0LWRlbW8tZGlyIiwiZW1haWwiOiJsaWxseS5kaWF6QGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJsaWxseSJ9.rQvgplTyCAfJYYYPKxVgPX0JTswls9GZppUwYMxRMY0">Lilly Diaz</option>
                    <option value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYW1hcmEiLCJuYW1lIjoiU2FtYXJhIEthdXIiLCJleHAiOjI1MTYyMzkwMjIsImlzcyI6InN0YXRpYy1mb3ItZGVtbyIsImNsaWVudF9pZCI6IldlYXZ5RGVtbyIsImRpciI6ImNoYXQtZGVtby1kaXIiLCJlbWFpbCI6InNhbWFyYS5rYXVyQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJzYW1hcmEifQ.UKLmVTsyN779VY9JLTLvpVDLc32Coem_0evAkzG47kM">Samara Kaur</option>
                    <option value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGFtIiwibmFtZSI6IkFkYW0gTWVyY2VyIiwiZXhwIjoyNTE2MjM5MDIyLCJpc3MiOiJzdGF0aWMtZm9yLWRlbW8iLCJjbGllbnRfaWQiOiJXZWF2eURlbW8iLCJkaXIiOiJjaGF0LWRlbW8tZGlyIiwiZW1haWwiOiJhZGFtLm1lcmNlckBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoiYWRhbSJ9.c4P-jeQko3F_-N4Ou0JQQREePQ602tNDhO1wYKBhjX8">Adam Mercer</option>
                </select>
            </div>
            <button>Login</button>
        </form>
    );


}

export default LoginForm;