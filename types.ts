export type Flight = {
    "date": string;
    "origin": string;
    "destination": string;
    "price": number;
    "availability": number;
};

export type Trip = {
    "id": string;
    "origin": Flight;
    "destination": Flight;
    "price": number;
    "availability": number;
    "days": number;
};