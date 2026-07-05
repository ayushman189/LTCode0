/**
 * @param {Generator} generator
 * @return {[Function, Promise]}
 */
var cancellable = function(generator) {
    let cancel;
    let isCancelled = false;
    let rejectCurrent = null;

    cancel = () => {
        if (isCancelled) return;
        isCancelled = true;
        if (rejectCurrent) {
            rejectCurrent("Cancelled");
        }
    };

    const promise = (async () => {
        let next;
        try {
            if (isCancelled) {
                next = generator.throw("Cancelled");
            } else {
                next = generator.next();
            }
        } catch (err) {
            throw err;
        }

        while (!next.done) {
            try {
                const res = await new Promise((resolve, reject) => {
                    rejectCurrent = (msg) => reject(msg);
                    
                    next.value.then(
                        (val) => {
                            rejectCurrent = null;
                            resolve(val);
                        },
                        (err) => {
                            rejectCurrent = null;
                            reject(err);
                        }
                    );
                });
                next = generator.next(res);
            } catch (err) {
                try {
                    next = generator.throw(err);
                } catch (genErr) {
                    throw genErr;
                }
            }
        }
        return next.value;
    })();

    return [cancel, promise];
};

