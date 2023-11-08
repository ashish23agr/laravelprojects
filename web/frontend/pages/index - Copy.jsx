import {
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Badge,
  TextContainer,
  Link,
  Page,
  Navigation,
  Frame,
  Thumbnail,
  Button,
  ButtonGroup,
} from '@shopify/polaris';
import React, { useState, useEffect } from 'react'
import {ViewMajor,ImageMajor} from '@shopify/polaris-icons'

export default function HomePage() {
  
  const [listItems, initList] = useState([])

   const removeDesign = async (id) => {
    try {
      // Send the form data to your Laravel backend using AJAX or fetch
      const response = await fetch('/api/remove-design/'+id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'id':id}),
      });

      if (response.ok) {
        // Handle success, e.g., show a success message
		//location.reload(true);
      } else {
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      // Handle network errors or other exceptions
    }
  };
  

  
  const fetchData = async () => {
    const response = await fetch('api/settings')
  
    if (!response.ok) {
      throw new Error('Data coud not be fetched!')
    } else {
      return response.json()
    }
  }
  useEffect(() => {
    fetchData()
      .then((result) => {
        initList(result.settings)
    //console.log(res.settings);
      })
      .catch((e) => {
        console.log(e.message)
      })
  }, [])
  
  const resourceName = {
    singular: 'order',
    plural: 'listItems',
  };

  const {selectedResources, allResourcesSelected, handleSelectionChange} =
    useIndexResourceState(listItems);

 var rows = [];
  if(listItems) {
      listItems.map(item => {
         var part_image = <Thumbnail source={ImageMajor} size="small" />
         if (item.part_image && item.part_image.includes("http")) {
           part_image = <Thumbnail source={item.part_image} size="small" />
         }
         var mask_image = <Thumbnail source={ImageMajor} size="small" />
         if (item.mask_image && item.mask_image.includes("http")) {
           mask_image = <Thumbnail source={item.mask_image} size="small" />
         }
         var queryParams = new URLSearchParams({selectedView: item.id});
         var endpoint = '/view-design'
         var endpointEdit = '/add-design'
         var url_data =  endpoint +"?"+queryParams
          var url_edit =  endpointEdit +"?"+queryParams 
         const valuesToAdd = [{
          id: item.index,
		  
          product_tag: item.product_tag,
          part_image:  part_image,
          mask_image:  mask_image,
          status: <Badge status="success">Active</Badge>,
          url_data: url_data,
          url_edit: url_edit,
		  setting_id: item.id,
          shop_id: item.shop_id,},];
         rows.push(...valuesToAdd);
      });
  } 
 console.log(rows);

  const rowMarkup = rows.map(
    (
      {id, product_tag, part_image, mask_image,status,url_data,url_edit,setting_id},
      index,
    ) => (
      <IndexTable.Row
        id={setting_id}
        key={setting_id}
        selected={selectedResources.includes(setting_id)}
        position={index}
      >
        <IndexTable.Cell>{index + 1 }</IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {product_tag}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{part_image}</IndexTable.Cell>
        <IndexTable.Cell>{mask_image}</IndexTable.Cell>
        <IndexTable.Cell>{status}</IndexTable.Cell>
        <IndexTable.Cell>
        <div className="bE49j">
         <ButtonGroup>
          <Link
            monochrome
            removeUnderline
            url= {url_data}
            onClick={() => console.log(`Clicked ${name}`)}
          >
          View
          </Link><br/>
          <Link
            monochrome
            removeUnderline
            url= {url_edit}
            onClick={() => console.log(`Clicked ${name}`)}
          >
          Edit
          </Link>
		  <Button plain destructive onClick={() => removeDesign(setting_id)}>
                Remove
            </Button>
			
          </ButtonGroup>
          </div>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <Page
      backAction={{content: 'Products', url: '#'}}
      title="DESIGN LIST"
      primaryAction={{content: <Link url="/add-design" monochrome="false" removeUnderline="true" target>ADD NEW DESIGN</Link>}}
    >
    <LegacyCard>
      <IndexTable
        resourceName={resourceName}
        itemCount={listItems.length}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          {title: 'S.No'},
          {title: 'Product Tag Name'},
          {title: 'Part Image'},
          {title: 'Mask Image'},
          {title: 'status'},
          {title: 'Action'},
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </LegacyCard>
   </Page>
  );
}