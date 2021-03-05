import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {MainPage} from "./Components/MainPage";
import {Nav} from "./Components/Nav";
import './responsive.css';
import {useState} from "react";

function App() {
  const [lang, setLang] = useState("eng");
  const dict = {
    eng: {
      english : "English",
      hungarian : "Hungarian",
      contacts : "Contacts",
      typeAName : "Type a name...",
      addANewContact : "Add a new contact",
      selectedContact : "Selected Contact",
      notChoosenYet : "not choosen yet",
      newContact : "New contact",
      firstName : "First name",
      lastName : "Last name",
      firstNameExample : "John",
      lastNameExample : "Doe",
      phones : "Phones",
      private : "Private",
      office : "Office",
      emails : "Webs & emails",
      address : "Address",
      add : "Add",
      edit : "Edit",
      deleteAcontactCard : "Delete a contact card",
      deleteTextBegin : "Are you sure you want to delete",
      deleteTextEnd : "'s contact card?",
      cancel : "Cancel",
      delete : "Delete",
    },
    hun: {
      english : "Angol",
      hungarian : "Magyar",
      contacts : "Kontaktok",
      typeAName : "Kit keresel...",
      addANewContact : "Új kontakt hozzáadása",
      selectedContact : "Kiválasztott kontakt",
      notChoosenYet : "még nincs kiválasztott",
      newContact : "Új kontakt",
      firstName : "Keresztnév",
      lastName : "Családnév",
      firstNameExample : "Ferenc",
      lastNameExample : "Nagy",
      phones : "Telefonszámok",
      private : "Magán",
      office : "Üzleti",
      emails : "E-mail címek, weboldalak",
      address : "Cím",
      add : "Hozzáadás",
      edit : "Szerkesztés",
      deleteTextBegin : "Biztosan törlöd",
      deleteTextEnd : " kontakt kártyáját?",
      cancel : "Mégsem",
      delete : "Törlés",
    }
  }

  return (
    <BrowserRouter>
      <LangContext.Provider value={{langGetSet:[lang, setLang], dict:dict}}>
        <Nav setLang={setLang} dict={dict}/>
        <Switch>
          <Route path="/" exact>
            <MainPage dict={dict}/>
          </Route>
          <Redirect to={"/"}/>
        </Switch>
      </LangContext.Provider>
    </BrowserRouter>
  );
}

export default App;


export const LangContext = React.createContext();