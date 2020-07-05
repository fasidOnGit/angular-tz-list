import { ValueTransformerPipe } from './value-transformer.pipe';
import {ITzTableColumn} from '../tz-table-column.interface';

describe('ValueTransformerPipe', () => {
  it('create an instance', () => {
    const pipe = new ValueTransformerPipe();
    expect(pipe).toBeTruthy();
  });
  it('#transform, should return the incoming value if valueTransaformer not provided', () => {
    const pipe = new ValueTransformerPipe();
    const column = {
      valueTransformer: undefined,
      property: 'fakeProp'
    } as unknown as ITzTableColumn;
    expect(
      pipe.transform('fake', column)
    ).toEqual('fake');
  });
  it('#transform, should transform the value when valueTransformer is provided', () => {
    const pipe = new ValueTransformerPipe();
    const column = {
      valueTransformer: jasmine.createSpy().and.returnValue('transformedFake'),
      property: 'fakeProp'
    } as unknown as ITzTableColumn;
    expect(
      pipe.transform('nonFake', column)
    ).toEqual('transformedFake');
  });
});
