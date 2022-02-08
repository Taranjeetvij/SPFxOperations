import * as React from 'react';
import DropzoneComponent from 'react-dropzone-component';
import { sp } from "@pnp/sp/presets/all"; 
import ListInfo from '../../../Constants/ListInfo';

import IFileUploadProps from './IFileUploadProps';

const FileUpload =(props:IFileUploadProps)=>{
    let componentConfig = {
        iconFiletypes: "jpg,png,jpeg".split(","), 
        showFiletypeIcon: true,     
        postUrl:ListInfo.ImageLibURL
    };
  
    let myDropzone;
    let eventHandlers = {
        /** This one receives the dropzone object as the first parameter
            and can be used to additional work with the dropzone.js
            object
        **/
        init: function(dz){       
            myDropzone=dz;
        },
        removedfile: function(file){                  
            sp.web.lists.getById(ListInfo.ImageLibGUID).rootFolder.files.getByName(file.upload.uuid +"_" +file.name).delete().then(t=>{
                 props.setBannerURL('');
            });          
        },
        processing: function (file, xhr) {      
            //myDropzone.options.url = `/_api/web/Lists/getById('${_listName}')/rootfolder/files/add(overwrite=true,url='${file.name}')`;
        },
        sending: function (file, xhr) {  
            sp.web.getFolderByServerRelativeUrl(ListInfo.ImageLibURL).files.add(file.upload.uuid +"_" + file.name , file, true).then((response)=>{
                props.setBannerURL(response.data['ServerRelativeUrl']);
            });
        },
        error:function(file,error,xhr){
          if(myDropzone.files.length>1){
            if(myDropzone){
                myDropzone.removeFile(file);
                alert('Please delete the existed file');
            }             
          }
        }
    };

    var djsConfig = {
        headers: {
            //"X-RequestDigest": this.props.digest
        },
        addRemoveLinks:true,
        acceptedFiles: ".jpeg,.jpg,.png",
        maxFiles:1
    };

    return (
        <DropzoneComponent  eventHandlers={eventHandlers} djsConfig={djsConfig} config={componentConfig}>
        <div className="dz-message icon ion-upload">Drop files here or click to upload.</div>  
      </DropzoneComponent>
    );
}

export default FileUpload;
