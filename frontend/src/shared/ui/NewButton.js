import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { faPlus } from "@fortawesome/free-solid-svg-icons";
const NewButton = ({onClick,name}) => {
  return (
    <div className="archive-report">
              <span
                className="add-row-ta archiveAdd"
                onClick={onClick}>
                <FontAwesomeIcon icon={faPlus} /> إضافة {name || ''}
              </span>
            </div>
  )
}

export default NewButton