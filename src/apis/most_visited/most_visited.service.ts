import mostVisited from './most_visited.model.js';
import Destino from '../location/location.model.js';


export const findAllMostvisited = async () => {
    try {
        const mostVisiteds = await mostVisited.find().sort({ rank: 1 });

        const result = await Promise.all(
            mostVisiteds.map(async (item) => {
                const destino = await Destino.findOne({
                    nombre: { $regex: new RegExp(item.nombre, 'i') }
                }).select('image');

                return {
                    ...item.toObject(),
                    image: destino?.image || null,
                };
            })
        );

        return result;
    } catch (error) {
        throw new Error('Error obteniendo los más visitados');
    }
};