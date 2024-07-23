import { Request, Response } from 'express'
import fs from 'fs-extra';
import path from 'path'
import { catchAsync } from '../utils';
import httpStatus from 'http-status';


export const createFiles = catchAsync(async (req: Request, res: Response) => {
  debugger
  const file = req.file as Express.Multer.File;
  if (!file) {
    return res.status(400).json({ message: 'No se han proporcionado archivos.' });
  }

  

  const filePath = path.join('uploads', file.filename); 
  return res.json({
    filePath: filePath,
    originalName: file.originalname
  });
});

export const getFile = async (req: Request, res: Response) => {
   
    const { url } = req.params;
  
    // Validar que se proporcionen los parámetros necesarios
    if (!url) {
      return res.status(400).json({ error: 'Parámetros faltantes' });
    }
  
    // Construir la ruta del archivo
    const filePath = path.join('uploads', String(url));
  
    // Verificar si el archivo existe
    
    if (await fs.pathExists(filePath)) {
      const absoluteFilePath = path.resolve(filePath);
      return  res.sendFile(absoluteFilePath);
    } else {
      return res.status(404).json({ error: 'El archivo no existe' });
    }
};

export const deleteFile = catchAsync(async (req: Request, res: Response) => {
  debugger
    const url = req.body['url'];
    const filePath = url
    console.log(filePath)
    if(filePath){
      // Verificar si el archivo existe
      if (await fs.pathExists(filePath)) {
        // Eliminar el archivo
        await fs.unlink(filePath);
        res.status(httpStatus.OK).send({ message: 'El archivo ha sido eliminado correctamente' });
      } else {
        res.status(httpStatus.NOT_FOUND).send({ error: 'El archivo no existe' });
      }
  }
});