import React from 'react'
import Image from 'next/image'

const AddCustomStageButton = () => {
  return (
    <div style={{width: 40, cursor: "pointer", border: "1px dashed #D5D7DA", borderRadius: 999, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
      <Image src="/temp/temporary-add-icon.svg" alt="add" width={17} height={17} />
    </div>
  )
}

export default AddCustomStageButton