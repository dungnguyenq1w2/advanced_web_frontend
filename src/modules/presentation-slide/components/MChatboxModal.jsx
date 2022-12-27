import 'modules/presentation-slide/assets/style/index.css'

import CModal from 'common/components/CModal'

import { Avatar, Tabs, Tooltip } from 'flowbite-react'
import moment from 'moment'

const MChatboxModal = ({ isOpen, onClose }) => {
    //#region data
    //#endregion

    //#region event
    //#endregion

    return (
        <>
            <CModal title="Chat" isOpen={isOpen} onClose={onClose}>
                <div className="h-[450px] overflow-auto">Chat</div>
            </CModal>
        </>
    )
}

export default MChatboxModal
