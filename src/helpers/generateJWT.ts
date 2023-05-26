import jsonwebtoken from "jsonwebtoken";

export const jwt = (uid: string): Promise<string | undefined> => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jsonwebtoken.sign(payload, process.env.JWT_SECRET || 'aiDASDf498yrbfa6sffTSaos8yr821rfv', {
            expiresIn: 30 * 60
        }, (err, token) => {
            if (err) {
                reject("No se pudo generar el token");
            } else {
                resolve(token);
            }
        });
    });
}