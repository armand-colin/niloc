import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { FieldType, FieldDescriptor, FormDescriptor, FormError, Result } from '../lib/main'

// --- Mocks/Helpers ---

// Simple Result implementation for testing if not available globally
// You might replace this with your actual Result import if needed
// const Result = {
//  ok: <T>(value: T) => ({ ok: true as const, value }),
//  error: <E>(error: E) => ({ ok: false as const, error }),
// };

// Helper to create a mock File
const createMockFile = (name: string, content: string, type: string): File => {
    const blob = new Blob([content], { type });
    return new File([blob], name, { type });
};

// Helper to create FormData
const createFormData = (data: Record<string, string | File | (string | File)[]>) => {
    const formData = new FormData();
    for (const key in data) {
        const value = data[key];
        if (Array.isArray(value)) {
            value.forEach(item => formData.append(key, item));
        } else {
            formData.append(key, value);
        }
    }
    return formData;
};


// --- FieldType Tests ---

describe('FieldType', () => {
    describe('string', () => {
        it('should parse valid strings', () => {
            const type = FieldType.string();
            expect(type.parse('hello')).toEqual(Result.ok('hello'));
        });

        it('should parse empty string as null', () => {
            const type = FieldType.string();
            expect(type.parse('')).toEqual(Result.ok(null));
        });

        it('should return error for non-string input', () => {
            const type = FieldType.string();
            const file = createMockFile('test.txt', 'content', 'text/plain');
            expect(type.parse(file)).toEqual(Result.error(undefined));
        });

        it('should enforce minLength', () => {
            const type = FieldType.string({ minLength: 5 });
            expect(type.parse('hi')).toEqual(Result.error(undefined));
            expect(type.parse('hello')).toEqual(Result.ok('hello'));
        });
    });

    describe('file', () => {
        const type = FieldType.file();

        it('should parse valid files', () => {
            const file = createMockFile('test.txt', 'content', 'text/plain');
            expect(type.parse(file)).toEqual(Result.ok(file));
        });

        it('should parse empty file as null', () => {
            const emptyFile = createMockFile('empty.txt', '', 'text/plain');
            expect(type.parse(emptyFile)).toEqual(Result.ok(null));
        });

        it('should return error for string input', () => {
            expect(type.parse('not a file')).toEqual(Result.error(undefined));
        });
    });

    describe('number', () => {
        const type = FieldType.number();

        it('should parse valid numbers', () => {
            expect(type.parse('123')).toEqual(Result.ok(123));
            expect(type.parse('-45.6')).toEqual(Result.ok(-45.6));
            expect(type.parse('0')).toEqual(Result.ok(0));
        });

        it('should return error for invalid number strings', () => {
            expect(type.parse('abc')).toEqual(Result.error(undefined));
            expect(type.parse('12a')).toEqual(Result.error(undefined));
            expect(type.parse('')).toEqual(Result.error(undefined)); // Does not coerce empty string
        });

        it('should return error for non-string input', () => {
            const file = createMockFile('test.txt', 'content', 'text/plain');
            expect(type.parse(file)).toEqual(Result.error(undefined));
        });
    });

    describe('date', () => {
        const type = FieldType.date();

        it('should parse valid date strings', () => {
            const dateStr = '2023-10-27T10:00:00.000Z';
            const expectedDate = new Date(dateStr);
            expect(type.parse(dateStr)).toEqual(Result.ok(expectedDate));
        });

        it('should return error for invalid date strings', () => {
            expect(type.parse('invalid-date')).toEqual(Result.error(undefined));
            expect(type.parse('')).toEqual(Result.error(undefined));
        });

        it('should return error for non-string input', () => {
            const file = createMockFile('test.txt', 'content', 'text/plain');
            expect(type.parse(file)).toEqual(Result.error(undefined));
        });
    });

    describe('json', () => {
        const schema = z.object({ id: z.number(), name: z.string() });
        const type = FieldType.json(schema);

        it('should parse valid JSON strings matching schema', () => {
            const data = { id: 1, name: 'Test' };
            expect(type.parse(JSON.stringify(data))).toEqual(Result.ok(data));
        });

        it('should return error for invalid JSON strings', () => {
            expect(type.parse('{ id: 1, name: ')).toEqual(Result.error(undefined)); // Malformed JSON
        });

        it('should return error for JSON not matching schema', () => {
            const data = { id: 'abc', name: 'Test' }; // id is not a number
            expect(type.parse(JSON.stringify(data))).toEqual(Result.error(undefined));
        });

        it('should return error for non-string input', () => {
            const file = createMockFile('test.txt', 'content', 'text/plain');
            expect(type.parse(file)).toEqual(Result.error(undefined));
        });
    });

    describe('custom', () => {
        it('should use the provided parse function', () => {
            const type = FieldType.custom<string>({
                parse: (data) => {
                    if (typeof data === 'string' && data.startsWith('custom:')) {
                        return data.substring(7);
                    }
                    throw new Error('Invalid custom format'); // Or return null
                },
                serialize: (value) => value
            });

            expect(type.parse('custom:value')).toEqual(Result.ok('value'));
            expect(type.parse('invalid')).toEqual(Result.error(undefined)); // Assumes error thrown maps to Result.error
        });

        it('should handle parse function returning null', () => {
            const type = FieldType.custom<string | null>({
                parse: (data) => {
                    if (typeof data === 'string' && data === 'empty') {
                        return null;
                    }
                    return typeof data === 'string' ? data : null;
                },
                serialize: (value) => {
                    if (value === null)
                        return "empty"
                    return value
                }
            });
            expect(type.parse('empty')).toEqual(Result.ok(null));
        });
    });

});


// --- FieldDescriptor Tests ---

describe('FieldDescriptor', () => {
    const nameField = new FieldDescriptor({ name: 'username', type: FieldType.string(), required: true, multiple: false });
    const tagsField = new FieldDescriptor({ name: 'tags', type: FieldType.string(), required: false, multiple: true });
    const ageField = new FieldDescriptor({ name: 'age', type: FieldType.number(), required: false, multiple: false });
    const avatarField = new FieldDescriptor({ name: 'avatar', type: FieldType.file(), required: true, multiple: false });

    it('should parse a required string field', () => {
        const formData = createFormData({ username: 'tester' });
        expect(nameField.parse(formData)).toEqual(Result.ok('tester'));
    });

    it('should return missing error for required string field', () => {
        const formData = createFormData({});
        expect(nameField.parse(formData)).toEqual(Result.error(FormError.missing('username'))); //
    });

    it('should return missing error for required empty string field', () => {
        const formData = createFormData({ username: '' });
        // String type parses "" to null, which triggers the required check
        expect(nameField.parse(formData)).toEqual(Result.error(FormError.missing('username'))); //
    });


    it('should parse an optional number field when present', () => {
        const formData = createFormData({ age: '25' });
        expect(ageField.parse(formData)).toEqual(Result.ok(25));
    });

    it('should parse an optional number field as null when absent', () => {
        const formData = createFormData({});
        expect(ageField.parse(formData)).toEqual(Result.ok(null));
    });

    it('should return invalid error for optional field with wrong type', () => {
        const formData = createFormData({ age: 'abc' });
        expect(ageField.parse(formData)).toEqual(Result.error(FormError.invalid('age'))); //
    });

    it('should parse multiple values', () => {
        const formData = createFormData({ tags: ['news', 'tech'] });
        expect(tagsField.parse(formData)).toEqual(Result.ok(['news', 'tech']));
    });

    it('should parse multiple values with empty strings as nulls', () => {
        const formData = createFormData({ tags: ['news', '', 'tech'] });
        // String type parses "" to null
        expect(tagsField.parse(formData)).toEqual(Result.ok(['news', null, 'tech']));
    });

    it('should parse empty array for multiple field when absent', () => {
        const formData = createFormData({});
        expect(tagsField.parse(formData)).toEqual(Result.ok([])); // Optional multiple defaults to empty array
    });

    it('should return invalid error if any multiple value fails parsing', () => {
        const field = new FieldDescriptor({
            name: 'nums',
            type: FieldType.number(),
            required: false,
            multiple: true
        })

        const formData = createFormData({ nums: ['1', 'abc', '3'] })

        expect(field.parse(formData)).toEqual(Result.error(FormError.invalid('nums'))) //
    });

    it('should parse a required file field', () => {
        const file = createMockFile('avatar.png', 'imagedata', 'image/png');
        const formData = createFormData({ avatar: file });
        expect(avatarField.parse(formData)).toEqual(Result.ok(file));
    });

    it('should return missing error for required file field if absent', () => {
        const formData = createFormData({});
        expect(avatarField.parse(formData)).toEqual(Result.error(FormError.missing('avatar'))); //
    });

    it('should return missing error for required empty file field', () => {
        const emptyFile = createMockFile('empty.png', '', 'image/png');
        const formData = createFormData({ avatar: emptyFile });
        // File type parses empty file to null, triggering required check
        expect(avatarField.parse(formData)).toEqual(Result.error(FormError.missing('avatar'))); //
    });

});


// --- FormDescriptor Tests ---

describe('FormDescriptor', () => {
    const formSchema = {
        name: { type: FieldType.string(), required: true },
        email: { type: FieldType.string() }, // Optional
        topics: { type: FieldType.string(), multiple: true, required: true },
        score: { type: FieldType.number() }
    };
    const formDescriptor = new FormDescriptor(formSchema);

    it('should parse valid form data', () => {
        const formData = createFormData({
            name: 'Alice',
            email: 'alice@example.com',
            topics: ['a', 'b'],
            score: '95'
        });
        const expected = {
            name: 'Alice',
            email: 'alice@example.com',
            topics: ['a', 'b'],
            score: 95
        };
        expect(formDescriptor.parse(formData)).toEqual(Result.ok(expected));
    });

    it('should parse valid form data with missing optional fields', () => {
        const formData = createFormData({
            name: 'Bob',
            // email is missing
            topics: ['c']
            // score is missing
        });
        const expected = {
            name: 'Bob',
            email: null, // Optional string defaults to null
            topics: ['c'],
            score: null  // Optional number defaults to null
        };
        expect(formDescriptor.parse(formData)).toEqual(Result.ok(expected));
    });

    it('should return the first error encountered (missing)', () => {
        const formData = createFormData({
            // name is missing
            email: 'test@example.com',
            topics: ['news']
        });
        expect(formDescriptor.parse(formData)).toEqual(Result.error(FormError.missing('name'))); //
    });

    it('should return the first error encountered (required multiple empty)', () => {
        const formData = createFormData({
            name: 'Charlie',
            email: 'charlie@example.com',
            // topics is present but empty - FieldDescriptor for topics will return missing error
        });
        // Although topics is present in FormData, parsing [] for required field fails
        expect(formDescriptor.parse(formData)).toEqual(Result.error(FormError.missing('topics'))); //
    });

    it('should return the first error encountered (invalid)', () => {
        const formData = createFormData({
            name: 'David',
            email: 'david@example.com',
            topics: ['tech', ''], // Valid (contains null)
            score: 'ninety' // Invalid number
        });
        expect(formDescriptor.parse(formData)).toEqual(Result.error(FormError.invalid('score'))); //
    });

});