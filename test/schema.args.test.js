import test from 'ava'
import { userType } from './fixture/userModel'
import buildArgs from '../src/schema/buildArgs'

let args
test.before(t => {
  args = buildArgs(userType)
})

test('it shold generate singular and plural args when giving a graphql type', t => {
  t.not(args.id, undefined)
  t.not(args.ids, undefined)
  t.not(args.name_first, undefined)
  t.not(args.name_firsts, undefined)
  t.not(args.name_last_fst, undefined)
  t.not(args.name_last_fsts, undefined)
  t.not(args.name_last_snd, undefined)
  t.not(args.name_last_snds, undefined)
  t.not(args.userName, undefined)
  t.not(args.userNames, undefined)
  t.not(args.age, undefined)
  t.not(args.ages, undefined)
  t.not(args.isBot, undefined)
  t.not(args.isBots, undefined)
  t.not(args.birth, undefined)
  t.not(args.births, undefined)
  t.not(args.binary, undefined)
  t.not(args.binaries, undefined)
  t.not(args.hobbies, undefined)
  t.deepEqual(args.hobby, undefined)
  t.not(args.currentSchool, undefined)
  t.not(args.currentSchools, undefined)
  t.not(args.education, undefined)
  t.deepEqual(args.educations, undefined)
})

test('should label onlyPlural to those path what only have plural', t => {
  t.falsy(args.id.onlyPlural)
  t.true(args.hobbies.onlyPlural)
  t.true(args.education.onlyPlural)
})

test('should label required: true to those required path', t => {
  t.falsy(args.id.required)
  t.true(args.userName.required)
  t.falsy(args.userNames.required)
  t.true(args.hobbies.required)
})
