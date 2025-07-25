const asynchandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next))
        .catch((e) => next(e))
    }
}
export {asynchandler}