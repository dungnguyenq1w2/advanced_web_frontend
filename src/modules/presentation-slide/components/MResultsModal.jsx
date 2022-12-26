import 'modules/presentation-slide/assets/style/index.css'

import CModal from 'common/components/CModal'

import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { Avatar, Tabs, Tooltip } from 'flowbite-react'
import moment from 'moment'

const MResultsModal = ({ isOpen, onClose, choices }) => {
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
                        Results
                    </Dialog.Title>
                    <XMarkIcon
                        className="absolute top-2 right-2 h-10 w-10 cursor-pointer text-gray-700"
                        onClick={onClose}
                    />
                    <hr />
                    <div className="h-[450px] overflow-auto">
                        <Tabs.Group
                            aria-label="Tabs with underline"
                            // eslint-disable-next-line react/style-prop-object
                            style="underline"
                            id="results__tab"
                        >
                            {choices?.map((choice, index) => (
                                <Tabs.Item
                                    key={choice.id}
                                    title={`${choice.content} (${choice.user_choices.length})`}
                                    active={index === 0 && true}
                                    // id="tab__item"
                                >
                                    <span className="block text-right text-sm text-gray-500">
                                        {choice.user_choices.length}{' '}
                                        {choice.user_choices.length > 1 ? 'records' : 'record'}
                                    </span>
                                    {choice.user_choices.map((e, i) => (
                                        <div
                                            key={e.id}
                                            className={`flex items-center justify-between border-b py-1 px-2`}
                                        >
                                            <div className="flex items-center">
                                                <Avatar
                                                    img={e.member ? e.member.image : null}
                                                    rounded={true}
                                                    className="mr-3"
                                                />
                                                <span>
                                                    {e.member ? e.member.name : 'Anonymous'}
                                                </span>
                                            </div>

                                            <span className="cursor-default text-sm text-gray-600">
                                                <Tooltip
                                                    content={moment(e.created_at)
                                                        .utc()
                                                        .format('hh:mm:ss MM/DD/YY')}
                                                >
                                                    {moment(e.created_at).utc().fromNow()}
                                                </Tooltip>
                                            </span>
                                        </div>
                                    ))}
                                </Tabs.Item>
                            ))}
                        </Tabs.Group>
                    </div>
                </Dialog.Panel>
            </CModal>
        </>
    )
}

export default MResultsModal
