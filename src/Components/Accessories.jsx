export function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function prepare(type, elements) {
    return Object.values(
        Object.entries(elements)
        .filter(([key, value]) => {
            if (value.name){ 
                const [dataType] = value.name.split("-");
                return dataType === type;
            } else {return false;}
        })
        .reduce((acc, [key, value]) => {
            const [_, name, index] = value.name.split("-");
            return {
                ...acc,
                [index]: {...acc[index], [name]: value.value}
            };
        }, {})
    );
}