import { useEffect, useRef, useState } from 'react'
import { fetchDynamicFormConfig } from '../services/dynamicFormApi.js'
import Loader from './Loader.jsx'
import StatusMessage from './StatusMessage.jsx'

function isFieldRequired(field) {
  return Boolean(field.required ?? field.mandatory)
}

function getInitialValue(field) {
  if (field.type === 'checkbox') {
    return Boolean(field.defaultValue)
  }

  return field.defaultValue ?? ''
}

function buildInitialValues(fields) {
  return fields.reduce((values, field) => {
    values[field.id] = getInitialValue(field)
    return values
  }, {})
}

function DynamicForm() {
  const [config, setConfig] = useState(null)
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('loading')
  const [submitMessage, setSubmitMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitTimeoutRef = useRef(null)

  useEffect(() => {
    let ignore = false

    async function loadForm() {
      try {
        setStatus('loading')
        const data = await fetchDynamicFormConfig()

        if (!ignore) {
          setConfig(data)
          setValues(buildInitialValues(data.fields))
          setStatus('succeeded')
        }
      } catch (error) {
        if (!ignore) {
          setStatus('failed')
          setErrors({ form: error.message })
        }
      }
    }

    loadForm()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current)
      }
    }
  }, [])

  function handleChange(event, field) {
    const value =
      field.type === 'checkbox' ? event.target.checked : event.target.value

    setValues((currentValues) => ({
      ...currentValues,
      [field.id]: value,
    }))
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field.id]: '',
      form: '',
    }))
    setSubmitMessage('')
  }

  function validateForm() {
    const nextErrors = {}

    config.fields.forEach((field) => {
      const value = values[field.id]
      const isEmpty =
        field.type === 'checkbox' ? value !== true : String(value || '').trim() === ''

      if (isFieldRequired(field) && isEmpty) {
        nextErrors[field.id] = 'Este campo es obligatorio.'
        return
      }

      if (field.type === 'number' && !isEmpty) {
        const numericValue = Number(value)

        if (Number.isNaN(numericValue)) {
          nextErrors[field.id] = 'Ingresa un numero valido.'
          return
        }

        if (field.min !== undefined && numericValue < field.min) {
          nextErrors[field.id] = `El valor minimo es ${field.min}.`
          return
        }

        if (field.max !== undefined && numericValue > field.max) {
          nextErrors[field.id] = `El valor maximo es ${field.max}.`
        }
      }
    })

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    if (!validateForm()) {
      setSubmitMessage('')
      return
    }

    setSubmitMessage('')
    setIsSubmitting(true)

    await new Promise((resolve) => {
      submitTimeoutRef.current = setTimeout(resolve, 2000)
    })

    submitTimeoutRef.current = null
    setIsSubmitting(false)
    setSubmitMessage('Envio exitoso')
  }

  function renderField(field) {
    if (field.type === 'select') {
      return (
        <select
          id={field.id}
          name={field.id}
          value={values[field.id] ?? ''}
          onChange={(event) => handleChange(event, field)}
          required={isFieldRequired(field)}
        >
          <option value="">Selecciona una opcion</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    if (field.type === 'checkbox') {
      return (
        <label className="dynamic-checkbox" htmlFor={field.id}>
          <input
            id={field.id}
            name={field.id}
            type="checkbox"
            checked={Boolean(values[field.id])}
            onChange={(event) => handleChange(event, field)}
            required={isFieldRequired(field)}
          />
          <span>{field.label}</span>
        </label>
      )
    }

    return (
      <input
        id={field.id}
        name={field.id}
        type={field.type}
        min={field.min}
        max={field.max}
        placeholder={field.placeholder}
        value={values[field.id] ?? ''}
        onChange={(event) => handleChange(event, field)}
        required={isFieldRequired(field)}
      />
    )
  }

  if (status === 'loading') {
    return <Loader label="Cargando formulario dinamico" />
  }

  if (status === 'failed') {
    return (
      <StatusMessage
        title="No fue posible cargar el formulario"
        message={errors.form}
        variant="error"
      />
    )
  }

  return (
    <form className="dynamic-form" onSubmit={handleSubmit} noValidate>
      <div className="dynamic-form__heading">
        <p className="eyebrow">Inputs dinamicos</p>
        <h1>{config.formTitle}</h1>
      </div>

      <div className="dynamic-form__grid">
        {config.fields.map((field) => (
          <div
            className={`dynamic-field dynamic-field--${field.type}`}
            key={field.id}
          >
            {field.type !== 'checkbox' ? (
              <label htmlFor={field.id}>
                {field.label}
                {isFieldRequired(field) ? <span>*</span> : null}
              </label>
            ) : null}
            {renderField(field)}
            {errors[field.id] ? <p role="alert">{errors[field.id]}</p> : null}
          </div>
        ))}
      </div>

      {submitMessage ? (
        <StatusMessage title={submitMessage} />
      ) : null}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="button-loader">
            <span aria-hidden="true" />
            Enviando
          </span>
        ) : (
          'Simular envio'
        )}
      </button>
    </form>
  )
}

export default DynamicForm
