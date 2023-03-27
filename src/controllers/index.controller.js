
export const getRoutes = async (req, res, next) => {

    // console.log(req.query);
    // const { fechaInicial, fechaFinal } = req.body;

    try {

        res.status(200).json({result: 'pong'})

    } catch (error) {
        res.status(400).json({message: "algo va mal"})
    }
}
