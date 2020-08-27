import React, { useEffect, useState } from 'react'
import ChartHandler from "../../components/ChartHandler"
import Helper from "../GatherInformation/utils/Helper"
import API from "../../utils/API"
import Loader from "../../components/Loader"
import { CLEAR_DATA, SET_SIMULATION_DATA, LOAD_SIMULATION } from "../GatherInformation/utils/action"
import { Button, Segment } from "semantic-ui-react"
import { useSimpleInvestmentContext } from "../GatherInformation/utils/GlobalState"

export default function SimulationDisplay(props) {



    const [state, dispatch] = useSimpleInvestmentContext()
    // const [localState, localDispatch] = 
    const [loaded, setLoaded] = useState(false)

    if (state.informationGathered && !loaded) {

        setLoaded(true)
        dispatch({ type: LOAD_SIMULATION })

    }

    useEffect(() => {

        setLoaded(false)

    }, [])

    useEffect(() => {
        console.log('useEffect Called');
        if (state.informationGathered) {

            const startDate = Helper.findFirstDateInYear(state.history, state.startYear)
            const endDate = Helper.findLastDateInYear(state.history)

            // // params startDate, endDate, symbol, blPerc, bhPerc, slPerc, shPerc
            API.runActiveTrading(startDate, endDate, state.symbol, 3, 2, 6, 4)
            //     // check this. 
                .then(res => {
                    // API.runMultipleSimulations([
                    //     ["NIO", "2005-09-11", "2020-02-14", 20000, "activeTrading", [res]],
                    //     ["NIO", "2005-09-11", "2020-02-14", 20000, "buyAndWait", []],

                    // ])
                    //     .then(res => {
                            console.log(res)
                            // dispatch({ type: SET_SIMULATION_DATA, data: data })
                        })
                }
    // }

    }, [state.loadingSimulation])

    const reset = () => {
        dispatch({ type: CLEAR_DATA })
        setLoaded(false)
    }

    console.log(state)

    if (!state.informationGathered) {
        return null
    }

    else if (!state.simulationData) {

        return (
            <Segment textAlign="center">
                <Loader type="cylon" color="red" />
            </Segment>
        )
    }

    else {
        return (
            <Segment textAlign="center">
                <ChartHandler simulations={state.simulationData} labels={[state.symbol]} />
                <Button className="btn-margin" primary onClick={reset}>Invest Again</Button>
            </Segment>

        )

    }


}