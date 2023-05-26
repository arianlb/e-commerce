import Product from '../models/product';
import User from '../models/user';

export const emailExists = async (email: string) => {
    const exists = await User.findOne({ email });
    if (exists) {
        throw new Error(`El email ${email} ya existe en la BD`);
    }
}

export const userExists = async (id: string) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error(`El usuario con el id ${id} no existe en la BD`);
    }
}

export const productExists = async (id: string) => {
    const product = await Product.findById(id);
    if (!product) {
        throw new Error(`El producto con el id ${id} no existe en la BD`);
    }
}

export const areValidRoles = async (roles: string[]) => {
    const validRoles = ['ADMIN_ROLE', 'EDITOR_ROLE', 'USER_ROLE'];
    for (const role of roles) {
        if (!validRoles.includes(role)) {
            throw new Error(`El rol ${role} no es un rol válido`);
        }
    }
    
}