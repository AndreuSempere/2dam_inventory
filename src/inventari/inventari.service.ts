import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventari } from './inventari.entity';
import * as convert from 'xml-js';
import { default as inventariData } from '../data/inventory';

@Injectable()
export class InventariService {

  constructor(
    @InjectRepository(Inventari)
    private InventariRepository: Repository<Inventari>,
  ) {}


  findAll(): Promise<Inventari[]> {
    return this.InventariRepository.find();
  }


  findOne(id: number): Promise<Inventari> {
    return this.InventariRepository.findOneBy({ id_inventory: id });
  }

  async createInventari(Inventari: Partial<Inventari>): Promise<{ message: string }> {
    const newInventari = this.InventariRepository.create(Inventari);
    await this.InventariRepository.save(newInventari);
    return { message: 'Inventario creado' };
  }

  async update(id: number, inventari: Inventari): Promise<Inventari> {
    await this.InventariRepository.update(id, inventari);
    return this.InventariRepository.findOneBy({ id_inventory: id });
  }

  async remove(id: number): Promise<void> {
    await this.InventariRepository.delete(id);
  }

  getAllInventaris(xml: string) {
    if (xml === 'true') {
      const jsonFormatted = { inventory_list: inventariData };
      const json = JSON.stringify(jsonFormatted);
      const options = { compact: true, ignoreComment: true, spaces: 4 };
      const result = convert.json2xml(json, options);
      return result;
    } else {
      return inventariData;
    }
  }

  getInventari(id: number, xml: string) {
    let i = 0;
    while (i < inventariData.length && inventariData[i].id_inventory != id) {
      i++;
    }
    if (inventariData[i]) {
      if (xml === 'xml') {
        const jsonFormatted = { inventory_type: inventariData[i] };
        const json = JSON.stringify(jsonFormatted);
        const options = { compact: true, ignoreComment: true, spaces: 4 };
        const result = convert.json2xml(json, options);
        return result;
      } else {
        return inventariData;
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  updateInventari(taskUpdated: any) {
    let i = 0;
    while (
      i < inventariData.length &&
      inventariData[i].id_inventory != taskUpdated.id_inventory
    ) {
      i++;
    }
    if (inventariData[i]) {
      inventariData[i] = taskUpdated;
      return inventariData[i];
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  deleteInventari(id: number) {
    let i = 0;
    while (i < inventariData.length && inventariData[i].id_inventory != id) {
      i++;
    }
    if (inventariData[i]) {
      return inventariData.splice(i, 1);
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
