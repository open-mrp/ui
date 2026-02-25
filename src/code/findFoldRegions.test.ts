import { findFoldRegions } from './findFoldRegions';

describe('findFoldRegions', () => {
    it('finds a simple block', () => {
        const code = `function foo() {
  return 1;
}`;
        const regions = findFoldRegions(code);
        expect(regions).toEqual([{ startLine: 0, endLine: 2 }]);
    });

    it('finds nested blocks', () => {
        const code = `function foo() {
  if (true) {
    bar();
  }
}`;
        const regions = findFoldRegions(code);
        expect(regions).toEqual([
            { startLine: 0, endLine: 4 },
            { startLine: 1, endLine: 3 },
        ]);
    });

    it('ignores single-line blocks', () => {
        const code = `const obj = { a: 1 };`;
        const regions = findFoldRegions(code);
        expect(regions).toEqual([]);
    });

    it('ignores braces in strings', () => {
        const code = `const s = "{ not a block }";
const x = 1;`;
        const regions = findFoldRegions(code);
        expect(regions).toEqual([]);
    });

    it('ignores braces in comments', () => {
        const code = `// { not a block }
/* { also not
a block } */
const x = 1;`;
        const regions = findFoldRegions(code);
        expect(regions).toEqual([]);
    });

    it('handles multi-line arrays', () => {
        const code = `const arr = [
  1,
  2,
  3,
];`;
        const regions = findFoldRegions(code);
        expect(regions).toEqual([{ startLine: 0, endLine: 4 }]);
    });
});
