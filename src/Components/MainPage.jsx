import {ContactList, AddContact, DeleteContact} from "./ContactRequests";

export function MainPage() {
    return (
        <div>
            <AddContact/>
            <ContactList/>
            <DeleteContact/>
        </div>
    );
}
