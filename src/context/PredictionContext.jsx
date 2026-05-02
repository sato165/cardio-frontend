import { createContext, useContext, useReducer } from 'react'

// Estado inicial
const initialState = {
  manual: {
    fields: {
      age_years: '', gender: '', height: '', weight: '',
      ap_hi: '', ap_lo: '', cholesterol: '', gluc: '',
      smoke: '', alco: '', active: '',
      colesterol_total_mgdl: '', hdl_mgdl: '', diabetes: '', tratamiento_antihipertensivo: ''
    },
    result: null,
    error: null,
    loading: false,
    patientData: null
  },
  upload: {
    files: [],
    tipo: null,
    manualValues: {},
    missingFields: [],
    result: null,
    error: null,
    loading: false,
    patientData: null,
    fileKey: 0 // para forzar la recreación del input file al resetear
  }
}

// Acciones
const ActionTypes = {
  SET_MANUAL_FIELDS: 'SET_MANUAL_FIELDS',
  SET_MANUAL_RESULT: 'SET_MANUAL_RESULT',
  SET_MANUAL_ERROR: 'SET_MANUAL_ERROR',
  SET_MANUAL_LOADING: 'SET_MANUAL_LOADING',
  SET_MANUAL_PATIENT: 'SET_MANUAL_PATIENT',
  RESET_MANUAL: 'RESET_MANUAL',
  SET_UPLOAD_FILES: 'SET_UPLOAD_FILES',
  SET_UPLOAD_TIPO: 'SET_UPLOAD_TIPO',
  SET_UPLOAD_MANUAL_VALUES: 'SET_UPLOAD_MANUAL_VALUES',
  SET_UPLOAD_MISSING: 'SET_UPLOAD_MISSING',
  SET_UPLOAD_RESULT: 'SET_UPLOAD_RESULT',
  SET_UPLOAD_ERROR: 'SET_UPLOAD_ERROR',
  SET_UPLOAD_LOADING: 'SET_UPLOAD_LOADING',
  SET_UPLOAD_PATIENT: 'SET_UPLOAD_PATIENT',
  RESET_UPLOAD: 'RESET_UPLOAD',
  INCREMENT_FILE_KEY: 'INCREMENT_FILE_KEY'
}

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_MANUAL_FIELDS:
      return { ...state, manual: { ...state.manual, fields: action.payload } }
    case ActionTypes.SET_MANUAL_RESULT:
      return { ...state, manual: { ...state.manual, result: action.payload, error: null } }
    case ActionTypes.SET_MANUAL_ERROR:
      return { ...state, manual: { ...state.manual, error: action.payload, result: null } }
    case ActionTypes.SET_MANUAL_LOADING:
      return { ...state, manual: { ...state.manual, loading: action.payload } }
    case ActionTypes.SET_MANUAL_PATIENT:
      return { ...state, manual: { ...state.manual, patientData: action.payload } }
    case ActionTypes.RESET_MANUAL:
      return { ...state, manual: { ...initialState.manual } }
    case ActionTypes.SET_UPLOAD_FILES:
      return { ...state, upload: { ...state.upload, files: action.payload.files, tipo: action.payload.tipo, manualValues: {}, missingFields: [] } }
    case ActionTypes.SET_UPLOAD_TIPO:
      return { ...state, upload: { ...state.upload, tipo: action.payload } }
    case ActionTypes.SET_UPLOAD_MANUAL_VALUES:
      return { ...state, upload: { ...state.upload, manualValues: action.payload } }
    case ActionTypes.SET_UPLOAD_MISSING:
      return { ...state, upload: { ...state.upload, missingFields: action.payload } }
    case ActionTypes.SET_UPLOAD_RESULT:
      return { ...state, upload: { ...state.upload, result: action.payload, error: null } }
    case ActionTypes.SET_UPLOAD_ERROR:
      return { ...state, upload: { ...state.upload, error: action.payload, result: null } }
    case ActionTypes.SET_UPLOAD_LOADING:
      return { ...state, upload: { ...state.upload, loading: action.payload } }
    case ActionTypes.SET_UPLOAD_PATIENT:
      return { ...state, upload: { ...state.upload, patientData: action.payload } }
    case ActionTypes.RESET_UPLOAD:
      return { ...state, upload: { ...initialState.upload, fileKey: state.upload.fileKey + 1 } }
    case ActionTypes.INCREMENT_FILE_KEY:
      return { ...state, upload: { ...state.upload, fileKey: state.upload.fileKey + 1 } }
    default:
      return state
  }
}

const PredictionContext = createContext()

export function PredictionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <PredictionContext.Provider value={{ state, dispatch, ActionTypes }}>
      {children}
    </PredictionContext.Provider>
  )
}

export function usePredictionContext() {
  const context = useContext(PredictionContext)
  if (!context) throw new Error('usePredictionContext debe usarse dentro de PredictionProvider')
  return context
}