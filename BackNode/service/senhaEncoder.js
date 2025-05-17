const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const PasswordService = {
    async encryptPassword(password) {
        try {
            const hash = await bcrypt.hash(password, SALT_ROUNDS);
            return hash;
        } catch (error) {
            console.error("Erro ao criptografar a senha:", error);
            throw error;
        }
    },

    async comparePassword(password, hash) {
        try {
            const match = await bcrypt.compare(password, hash);
            return match;
        } catch (error) {
            console.error("Erro ao comparar a senha:", error);
            throw error;
        }
    }
};

module.exports = PasswordService;
