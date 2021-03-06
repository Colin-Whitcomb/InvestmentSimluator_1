import React, {createContext, useContext, useReducer} from "react"
import Helper from "./Helper"
import {INVALID, SET_STOCK, SET_START_YEAR, SET_END_YEAR, SYMBOL_LOADING, SET_INVESTMENT, SET_HISTORY, CLEAR_DATA, SET_SIMULATION_DATA, LOAD_SIMULATION} from "./action"

const InformationContext = createContext()
const {Provider} = InformationContext

const reducer = (state, action) => {
    switch (action.type) {
        case SET_STOCK:
            return {...state, symbol: action.symbol, symbolLoading: false, activeForm: 1}
            break
        case SYMBOL_LOADING:
            return {...state, symbolLoading: true}
            break
        case SET_START_YEAR:
            const earliestDate = Helper.findFirstDateInYear(state.history, action.startYear)
            const lowestPrice = eval(state.history[earliestDate].markPrice)
            return {...state, startYear: action.startYear, activeForm: 2, smallestInvestment: Math.ceil(lowestPrice/10)*10}
            break
        case SET_END_YEAR:
            return {...state, endYear: action.endYear, activeForm: 3}
            break
        case SET_INVESTMENT:
            
            return {...state, investment: eval(action.investment).toFixed(), informationGathered: true }
        case SET_HISTORY:
            return {...state, history: action.history}
            break
        case LOAD_SIMULATION:
            return {...state, loadingSimulation: true}
        case SET_SIMULATION_DATA:
            return {...state, simulationData: action.data}
        case CLEAR_DATA: 
            return {
                activeForm: 0,
                symbol: null,
                startYear: null, 
                endYear: null,
                investment: null,
                smallestInvestment: null,
                symbolLoading: false,
                loadingSimulation: false,
                startDateLoading: false,
                endYearLoading: false,
                investmentLoading: false,
                history: null,
                informationGathered: false,
                simulationData: null
                
            }
            break
        case INVALID:
            return {...state, symbolLoading: false}
    }
}

function InformationProvider({value=[], ...props}) {
    const [state, dispatch] = useReducer(reducer, { 
        activeForm: 0,
        symbol: null,
        startYear: null, 
        endYear: null,
        investment: null,
        smallestInvestment: null,
        loadingSimulation: false,
        symbolLoading: false,
        startDateLoading: false,
        endYearLoading: false,
        investmentLoading: false,
        history: null,
        informationGathered: false,
        simulationData: null
        
    })

    return <Provider value={[state, dispatch]} {...props}/>
}

function useInformationContext() {
    return useContext(InformationContext)
}

export {InformationProvider, useInformationContext}

