// Encrypt data from DATA_BLOB DataIn to DATA_BLOB DataOut.

//--------------------------------------------------------------------
// Declare and initialize variables.

DATA_BLOB DataIn;
DATA_BLOB DataOut;
BYTE *pbDataInput =(BYTE *)"Hello world of data protection.";
DWORD cbDataInput = strlen((char *)pbDataInput)+1;

//--------------------------------------------------------------------
// Initialize the DataIn structure.

DataIn.pbData = pbDataInput;    
DataIn.cbData = cbDataInput;

//--------------------------------------------------------------------
//  Begin protect phase. Note that the encryption key is created
//  by the function and is not passed.

if(CryptProtectData(
     &DataIn,
     L"This is the description string.", // A description string
                                         // to be included with the
                                         // encrypted data. 
     NULL,                               // Optional entropy not used.
     NULL,                               // Reserved.
     NULL,                               // Pass NULL for the 
                                         // prompt structure.
     0,
     &DataOut))
{
     printf("The encryption phase worked.\n");
     LocalFree(DataOut.pbData);
}
else
{
    printf("Encryption error using CryptProtectData.\n");
    exit(1); 
}
