
export const LOGO = `

            Version 0.0
            █▀█ ▀█▀ █ █ ▄▀▄ █   ▀█▀ █ █ █▄ ▄█   
            █▀▄ ▄█▄ ▀▄▀ █▀█ █▄▄ ▄█▄ █▄█ █ ▀ █       
                               Account Server
                               
`;

export const passwordSaltRounds = 10;

export const usernameRegex = /^[A-Za-z_-]{5,16}$/;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/;
export const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const databasePath = "mongodb://127.0.0.1:27017";

export const serverPort = 1840;
export const apiPort = 8080;
export const apiPath = "/api/v1";


export const usernameRequirementMessage = "Username must be between 5 and 16 characters long, must include only characters, numbers, underscore and hyphen.";
export const passwordRequirementMessage = "Password must be between 8 and 30 characters long, must include at least one letter, number and special character.";


export const PasetoPrivateKey = process.env["PASETO_SECRET_KEY"]!;
export const PasetoPublicKey = process.env["PASETO_PUBLIC_KEY"]!;
export const UserSessionTimeout = 15000;
