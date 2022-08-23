import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleChevronLeft, faCircleChevronRight, faCircleArrowRight, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FormField } from './Styles'

interface SelectionInputProps {
  available: any[],
  chosen: any[],
  setChosen(chosen: any): void,
  setAvailable(available: any): void,
  selectionName: string,
  editable?: boolean
}

const SelectionInput = ({ available, chosen, setChosen, setAvailable, selectionName, editable = false}: SelectionInputProps) => {
  const [availableSelection, setAvailableSelection] = useState<any[]>([])
  const [chosenSelection, setChoseneSelection] = useState<any[]>([])
  const [filteredAvailable, setFilteredAvailable] = useState(available)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    setFilteredAvailable(available)
  }, [available, chosen])

  const handleAvailableSelectionChange = useCallback((event: any) => {
    const options = event.target.options
    const selected: any[] = []

    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        selected.push(options[i].value)
      }
    }

    setAvailableSelection(selected)
  }, [])

  const handleChosenSelectionChange = useCallback((event: any) => {
    const options = event.target.options
    const selected = []

    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        selected.push(options[i].value)
      }
    }

    setChoseneSelection(selected)
  }, [])

  const handleChooseAllButton = () => {
    setChosen((chosen: any[]) => chosen.concat(available))
    setAvailable([])
    setFilteredAvailable([])
  }

  const handleRemoveAllButton = () => {
    setAvailable((available: any[]) => available.concat(chosen))
    setChosen([])
  }

  const handleChooseArrow = () => {
    var newChosen = chosen

    availableSelection.forEach((value) => {
      available.forEach((option) => {
        if (value === option.pk.toString()) {
          newChosen.push(option)
        }
      })
    })

    const newAvailable = available.filter((option) => {
      return !availableSelection.includes(option.pk.toString())
    })

    setChosen(newChosen)
    setAvailable(newAvailable)
  }

  const handleRemoveArrow = () => {
    var newAvailable = available

    chosenSelection.forEach((value) => {
      chosen.forEach((option) => {
        if (value === option.pk.toString()) {
          newAvailable.push(option)
        }
      })
    })

    const newChosen = chosen.filter((option) => {
      return !chosenSelection.includes(option.pk.toString())
    })

    setChosen(newChosen)
    setAvailable(newAvailable)
  }

  const handleFilterInput = useCallback(
    (e: any) => {
      setFilter(e.target.value)

      const filtered = available.filter((item) => {
        if (item.display_name.includes(e.target.value)) {
          return item
        }
      })

      setFilteredAvailable(filtered)
    },
    [available]
  )

  return editable ? (
    <FormField alignStart>
      <div className="col-lg-3 col-sm-2">
        <span className="label"> {selectionName} </span>
      </div>
      <div className="col-lg-9 col-sm-10 selector">
        <div className="selector-options">
          <div className="options-title"> Available {selectionName}</div>
          <div className="options-filter">
            <input type="text" placeholder="Filter" value={filter} onChange={handleFilterInput}></input>
          </div>
          <div>
            <select
              className="options-list"
              multiple
              value={availableSelection}
              onChange={handleAvailableSelectionChange}
            >
              {filteredAvailable.map((item) => {
                return (
                  <option value={item.pk} key={item.pk}>
                    {item.display_name}
                  </option>
                )
              })}
            </select>
          </div>
          <div className="select-shortcut">
            <button type="button" onClick={handleChooseAllButton}>
              Choose all <FontAwesomeIcon icon={faCircleChevronRight}/>
            </button>
          </div>
        </div>
        <ul className="selector-chooser">
          <li className={availableSelection.length !== 0 ? 'active' : ''}>
            <button type="button" onClick={handleChooseArrow}>
              <FontAwesomeIcon icon={faCircleArrowRight} />
            </button>
          </li>
          <li className={chosenSelection.length !== 0 ? 'active' : ''}>
            <button type="button" onClick={handleRemoveArrow}>
              <FontAwesomeIcon icon={faCircleArrowLeft} />
            </button>
          </li>
        </ul>
        <div className="selector-chosen">
          <div className="chosen-title"> Chosen permissions</div>
          <div>
            <select className="chosen-list" multiple value={chosenSelection} onChange={handleChosenSelectionChange}>
              {chosen.map((permission) => {
                return (
                  <option value={permission.pk} key={permission.pk}>
                    {permission.display_name}
                  </option>
                )
              })}
            </select>
          </div>
          <div className="select-shortcut">
            <button type="button" onClick={handleRemoveAllButton}>
              <FontAwesomeIcon icon={faCircleChevronLeft} /> Remove all
            </button>
          </div>
        </div>
      </div>
    </FormField>
  ) : (
    <FormField>
      <div className="col-lg-3 col-sm-2">
        <span className="label"> {selectionName} </span>
      </div>
      <div className="col-lg-9 col-sm-10">
        {chosen.map((item, i) => {
          return (
            <span key={item.pk}>
              {item.display_name}
              {chosen[i + 1] ? ', ' : ''}
            </span>
          )
        })}
      </div>
    </FormField>
  )
}

SelectionInput.proptypes = {
  available: PropTypes.array.isRequired,
  chosen: PropTypes.array.isRequired,
  setChosen: PropTypes.func.isRequired,
  setAvailable: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired
}

export default SelectionInput
