export type Root = {
    id: string
    message: {
        uid: string
        nsp: string
        type: string
        data?: {
            packet: {
                type: number
                data: [string, number]
            }
            opts: {
                rooms: Array<string>
                except: Array<any>
                flags: {}
            }
        }
    }
}
