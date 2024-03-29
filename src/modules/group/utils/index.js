export function detachedByKey(data, key) {
    if (!data) return []
    var result = []

    for (let user of data) if (parseInt(user.role_id) === key) result.push(user)

    return result
}

export function detachedUserGroup(data) {
    if (!data) return []
    const result = []

    result.owner = detachedByKey(data, 1)
    result.co_owner = detachedByKey(data, 2)
    result.member = detachedByKey(data, 3)
    // console.log(result)

    return result
}
