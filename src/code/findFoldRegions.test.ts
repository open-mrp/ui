import { findFoldRegions } from './findFoldRegions';

describe('findFoldRegions', () => {
    describe('bracket-based', () => {
        it('finds a simple block', () => {
            const code = `function foo() {
  return 1;
}`;
            const regions = findFoldRegions(code);
            expect(regions).toEqual([{ startLine: 0, endLine: 2, type: 'bracket' }]);
        });

        it('finds nested blocks', () => {
            const code = `function foo() {
  if (true) {
    bar();
  }
}`;
            const regions = findFoldRegions(code);
            expect(regions).toEqual([
                { startLine: 0, endLine: 4, type: 'bracket' },
                { startLine: 1, endLine: 3, type: 'bracket' },
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
            expect(regions).toEqual([{ startLine: 0, endLine: 4, type: 'bracket' }]);
        });
    });

    describe('indentation-based (Python)', () => {
        it('finds a function block', () => {
            const code = `def greet(name):
    print(f"Hello, {name}")
    return name`;
            const regions = findFoldRegions(code, 'python');
            expect(regions).toContainEqual({ startLine: 0, endLine: 2, type: 'indent' });
        });

        it('finds nested blocks', () => {
            const code = `def foo():
    if True:
        x = 1
    return x`;
            const regions = findFoldRegions(code, 'python');
            expect(regions).toContainEqual({ startLine: 0, endLine: 3, type: 'indent' });
            expect(regions).toContainEqual({ startLine: 1, endLine: 2, type: 'indent' });
        });

        it('handles for loops', () => {
            const code = `for i in range(10):
    print(i)
    total += i`;
            const regions = findFoldRegions(code, 'python');
            expect(regions).toContainEqual({ startLine: 0, endLine: 2, type: 'indent' });
        });

        it('skips blank lines within a block', () => {
            const code = `def foo():
    x = 1

    y = 2
    return x + y`;
            const regions = findFoldRegions(code, 'python');
            expect(regions).toContainEqual({ startLine: 0, endLine: 4, type: 'indent' });
        });

        it('does not detect indent blocks for non-python', () => {
            const code = `def foo():
    x = 1
    return x`;
            const regions = findFoldRegions(code, 'javascript');
            const indentRegions = regions.filter((r) => r.type === 'indent');
            expect(indentRegions).toEqual([]);
        });

        it('ignores colon in comments', () => {
            const code = `x = 1  # not a block:
y = 2`;
            const regions = findFoldRegions(code, 'python');
            const indentRegions = regions.filter((r) => r.type === 'indent');
            expect(indentRegions).toEqual([]);
        });
    });
});
