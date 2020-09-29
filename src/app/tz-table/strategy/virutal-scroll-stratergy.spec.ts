import { CustomVirtualScrollStrategy } from "./virtual-scroll-stratergy";

describe('VirtualScrollStratergy', () => {
    let virtualScrollStratergy: CustomVirtualScrollStrategy;
    beforeEach(() => {
        virtualScrollStratergy = new CustomVirtualScrollStrategy();
    });

    it('should create', () => {
        expect(virtualScrollStratergy).toBeDefined();
    });

    it('#attach', () => {
        spyOn(virtualScrollStratergy, 'onDataLengthChanged');
        virtualScrollStratergy.attach({} as any);
        expect(virtualScrollStratergy.onDataLengthChanged).toHaveBeenCalled();
    });
});
