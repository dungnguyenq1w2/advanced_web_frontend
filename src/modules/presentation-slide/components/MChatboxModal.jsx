import 'modules/presentation-slide/assets/style/index.css'

import CModal from 'common/components/CModal'

import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { Avatar, Tabs, Tooltip } from 'flowbite-react'
import moment from 'moment'

const MChatboxModal = ({ isOpen, onClose }) => {
    //#region data
    //#endregion

    //#region event
    //#endregion

    return (
        <>
            <CModal isOpen={isOpen} onClose={onClose}>
                <Dialog.Panel className="max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                        as="h3"
                        className="px-40 py-4 text-center text-xl font-medium leading-6 text-gray-900"
                    >
                        Chat
                    </Dialog.Title>
                    <XMarkIcon
                        className="absolute top-2 right-2 h-10 w-10 cursor-pointer text-gray-700"
                        onClick={onClose}
                    />
                    <hr />
                    <div className="h-[450px] overflow-auto">Chat</div>
                </Dialog.Panel>
            </CModal>
        </>
    )
}

export default MChatboxModal
