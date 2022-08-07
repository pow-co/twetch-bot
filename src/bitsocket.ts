const EventSource = require('eventsource')

import { EventEmitter } from "events"

const BOT_TWETCH_ID = 80659

export function bitsocket(app_id: string) : EventEmitter {

    const emitter = new EventEmitter();

    const query = {
        q: {
          find: {
            "out.s2": app_id,
            "out.s21": 'reply'
          },
          project: {
            "raw": 1,
            "blk": 1,
            "tx.h": 1,
            "timestamp": 1,
            "out.i": 1,
            "out.s2": 1,
            "out.s3": 1,
            "out.s4": 1,
            "out.s5": 1,
            "out.s6": 1,
            "out.s7": 1,
            "out.s8": 1,
            "out.s9": 1,
            "out.s10": 1,
            "out.s11": 1,
            "out.s19": 1,
            "out.s21":1,
            "out.s31":1,
            "out.o1": 1
          }
        },
    }

    var b64 = Buffer.from(JSON.stringify(Object.assign({"v":3}, query))).toString("base64")

    const sock = new EventSource('https://txo.bitsocket.network/s/' + b64)

    sock.onmessage = async function(e) {

        let payload = JSON.parse(e.data)

        if(payload.data.length > 0) {

            const event = payload.data[0]

            const output = {
                call_txid: event.tx.h,
                content: event.out[0].s3,
                target_txid: event.out[0].s19,
                type: event.out[0].s21,
                caller_address: event.out[0].s31,
                value:0.05
            }

            console.log(output)

            // Need regex
            if (output.content.startsWith(`/pay @${BOT_TWETCH_ID} $0.05`)){
                
                console.log('boostpow bot called')

                if (emitter) {

                    emitter.emit('order', output.target_txid)

                    emitter.emit('*', output)
                        
                }



            }

        }
    }

    return emitter
}