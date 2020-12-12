import React, { useState, useEffect, useContext } from 'react'
import CollectionPreview from './CollectionPreview'
import Panel from '../Panel'
import CollectionCreate from '../../CollectionCreate'
import { Route } from 'react-router-dom'
import ConfirmationDialog from './ConfirmationDialog'
import ItemsGrid from '../ItemsGrid'
import { useHttp } from '../../../hooks/http.hook'
import { AuthContext } from '../../../context/AuthContext'
import Loader from '../../../components/Loader'

const CollectionsPanel = () => {
    const [collections, setCollections] = useState(null)
    const {token} = useContext(AuthContext)
    const {request, loading} = useHttp(token)

    const [confirmationDetails, setConfirmationDetails] = useState({
        isOpen: false,
        collection: null
    })

    useEffect(() => {
        const fetchCollections = async () => {
            try{
                const data = await request('/api/collections')
                setCollections(data.collections)
            }catch(e){
                console.error(e)
            }
        }
        fetchCollections()
        //let unsubscribe = manager.listenCollections(setCollections)
        //return (unsubscribe)
    }, [])

    const confirmDelete = collection => {
        setConfirmationDetails({
            isOpen:true, 
            collection
        })
    }

    const handleDelete = (id, withCards) => {
        //manager.deleteCollection(id, withCards)
        closeConfirmation()
    }

    const closeConfirmation = () => {
        setConfirmationDetails(
            {
                isOpen: false,
                collection: null
            }
        )
    }
    if(loading){
        return <Loader/>
    }

    return (
        <Panel>
            <ItemsGrid newItemUrl={"/manage/collections/new"}>
                {collections ? 
                    collections.map(c =>
                         <CollectionPreview collection={c} key={c.id} onDelete={() => confirmDelete(c)} />) 
                    : null
                    }
            </ItemsGrid>
            <Route path='/manage/collections/new'>
                <CollectionCreate/>
            </Route>
            <ConfirmationDialog 
                isOpen={confirmationDetails.isOpen} 
                collection={confirmationDetails.collection} 
                onDismiss={closeConfirmation} 
                onConfirm={handleDelete} 
                />
        </Panel>
        )
}

export default CollectionsPanel
