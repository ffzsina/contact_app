import React from 'react';
import {NavLink} from "react-router-dom";
import {LangContext} from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

export function Nav(props) {
    const langCntx = React.useContext(LangContext);

    return(
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <NavLink to={"/"} exact className="navbar-brand">
                <h2><FontAwesomeIcon icon={faUsers}/></h2>
            </NavLink>
            <div className="navbar-collapse"/>
            <div>
                <button className={"btn m-1 " + (langCntx.langGetSet[0]==="eng"?"btn-light":"btn-outline-light")}
                    onClick={() => langCntx.langGetSet[1]("eng")}
                >
                    {langCntx.dict[langCntx.langGetSet[0]].english}
                </button>
                <button className={"btn m-1 " + (langCntx.langGetSet[0]==="hun"?"btn-light bg-light":"btn-outline-light")}
                    onClick={() => langCntx.langGetSet[1]("hun")}
                >
                    {langCntx.dict[langCntx.langGetSet[0]].hungarian}
                </button>
            </div>
        </nav>
    );
}