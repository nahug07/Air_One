import DATA from "./db/data_base.json"
import { Flight, Trip } from "./types"
import crypto from "crypto"

const api = {
    trips: {
        list: async (origin: Flight['origin']): Promise<Trip[]> => {
            const [origins, destinations] = DATA.filter((flight: Flight) => new Date(flight.date) > new Date()).reduce<[Flight[], Flight[]]>(
                ([origins, destinations], flight) => {
                    if (flight.origin === origin) {
                        origins.push(flight)
                    } else if (flight.destination === origin) {
                        destinations.push(flight)
                    }
                   return [origins, destinations] 
                },
                 [[], []]
            );

            const trips: Trip[] = []

            for (let origin of origins) {
                for (let destination of destinations) {
                    const originDate = +new Date(origin.date)
                    const destinationDate = +new Date(destination.date)
                    const totalPrice = destination.price + origin.price

                    if (destinationDate > originDate && totalPrice < 800) {
                        const diffDays = Math.ceil((destinationDate - originDate) / (1000 * 60 * 60 * 24))

                        trips.push({
                            id: crypto.randomUUID(),
                            availability: Math.min(origin.availability, destination.availability),
                            price: Math.ceil(origin.price + destination.price),
                            days: diffDays,
                            destination: destination,
                            origin: origin,
                        })
                    }
                }
            }

            return trips
        },
    },

    origin: {
        list: async (): Promise<Flight["origin"][]> => {
            const origins = new Set<Flight["origin"]>()

            for (let flight of DATA) {
                origins.add(flight.origin)
            }
            return Array.from(origins)
        },
    },
};

export default api;